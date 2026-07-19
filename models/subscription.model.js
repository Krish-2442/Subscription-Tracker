import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minlength: 6,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price cannot be negative"]
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        enum: ['USD', 'Rupees', 'EURO', 'Pound', 'Yen'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ['Sports', 'Finance', 'News', 'Entertainment', 'Politics'],
    },
    paymentMethod: {
        type: String,
        required: [true, "PaymentMethod is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Cancelled', 'Expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: "Start Date must be in the Past",
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.endDate
            },
            message: "Renewal Date must be after end date",
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    }
}, { timestamps: true });

// Auto calculate renewal date if missing, based on start date and frequency
// pre() is calles middleware (or hook) : Before this operation happens, run this function first.
// pre("save") : before save
// pre("validate") : before validation
subscriptionSchema.pre("save", async function (next) {
    if(!this.renewalDate) {
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        // doing -> this.renewalDate = this.startDate; because that would point both variables to the same Date object.
        // so create new Copy
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency.toLowerCase()]);
    }

    // Auto update the status if renewal date has passed
    if(this.renewalDate < new Date()) {
        this.status = 'Expired';
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;