import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Escalation SLA Hours
const SLA_HOURS = {
  critical: 72, // 3 days
  moderate: 120, // 5 days
};

export const checkEscalations = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const now = new Date().getTime();
  
  try {
    const issuesSnapshot = await db.collection("issues")
      .where("status", "in", ["Reported", "Verified", "In Progress"])
      .get();
      
    const batch = db.batch();
    let escalatedCount = 0;

    issuesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.reportedAt || !data.severity) return;

      const reportedTime = new Date(data.reportedAt).getTime();
      const severity = data.severity as "critical" | "moderate";
      const sla = SLA_HOURS[severity];

      if (!sla) return;

      const limitTime = reportedTime + (sla * 60 * 60 * 1000);

      // If the current time is past the limit, and it's not resolved, mark it as Escalated
      if (now > limitTime && data.status !== "Escalated") {
        batch.update(doc.ref, { status: "Escalated", escalatedAt: new Date().toISOString() });
        escalatedCount++;
      }
    });

    if (escalatedCount > 0) {
      await batch.commit();
      console.log(`Successfully escalated ${escalatedCount} issues.`);
    } else {
      console.log("No issues to escalate.");
    }
    
    return null;
  } catch (error) {
    console.error("Error running checkEscalations:", error);
    return null;
  }
});
