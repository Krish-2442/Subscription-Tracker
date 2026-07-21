import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// above two step is needed because we use type: module in package.json so it only allow to use import not require() so to allow this we use above steps
// and we use require here because @upstash/workflow/express is not compatible with ES modules, so we need to use require() to import it.
const { serve } = require("@upstash/workflow/express");

import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";
import {sendReminderEmail} from "../utils/send-email.js";


const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalData = dayjs(subscription.renewalDate);

    if(renewalData.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. stopping workflow` );
        return;
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalData.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days Before`, reminderDate);
        }
        if(dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
})

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get-subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping reminder for ${label} for ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering reminder: ${label}`);

        // Send email logic here, e.g., using a mailer service
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}