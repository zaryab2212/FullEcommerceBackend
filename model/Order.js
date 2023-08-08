const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    items: { type:[mongoose.Schema.Types.Mixed] ,require:true},
    // price:{type:Number, require:true,min:[1,"price must be more than 1"],max:[10000,"price is exceed more than the limit price"]}
    totalItems:{type:Number},
    totalAmount:{type:Number},
    user: { type: mongoose.Schema.Types.ObjectId, ref:"User", require:true},
    selectedPaymentMethod:{type:String,require:true},
    status:{type:String, default:'pending'},
    selectedAddress:{ type: mongoose.Schema.Types.Mixed,require:true}

})



const virtual = OrderSchema.virtual("id")
virtual.get(function(){
    return this.id
})
virtual.set("toJSON",{
virtual:true,
versionKey:false,
transform: function(doc,ret) {delete ret._id}

})

exports.Order = mongoose.model("Order",OrderSchema)