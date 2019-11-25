const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const { Order, validate } = require("../models/order.model");

router.get("/all", auth, (req, res) => {
    Order.find((err, result) => {
        if (err) res.send(err);
        res.send(JSON.stringify(result));
    })
})
router.put("/addnew", auth, (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    if (req.user.role == "c") {
        const order = new Order({
            name: req.body.name,
            quantity: req.body.quantity,
        });
        order.save();
        var io = req.app.get('socketio');
        io.emit('refresh');
        res.status(200).send({ result: true });
    } else {
        res.status(403).send(JSON.stringify({ "msg": "access denied." }));
    }
})
router.patch("/deliver", auth, async (req, res) => {
    const order = await Order.update({ "_id": req.body._id }, { $set: { delivered: true } });
    // its nessesory to check acceptedUserId first, but i ignored

    var io = req.app.get('socketio');
    io.emit('refresh');
    res.send(JSON.stringify({ result: true }));

})

router.patch("/accept", auth, async (req, res) => {
    const order = await Order.update({ "_id": req.body._id }, { $set: { accepted: true, acceptedUserId: req.user._id } });

    var io = req.app.get('socketio');
    io.emit('refresh');
    res.send(JSON.stringify({ result: true }));

})

module.exports = router;