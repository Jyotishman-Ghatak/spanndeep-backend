const mongoose = require("mongoose");
const User = require("../models/user");


exports.Authority = async (req, res) => {
    const rolesValue = {
        "SUPERADMIN": 1,
        "ADMIN": 2,
        "POWERUSER": 3,
        "USER": 4
    };
    try {
        const loggedUser = await User.findOne({ email: req.user.email })
        const roles = Object.keys(rolesValue)
        const { email, userType } = req.body
        if (!email || !userType) {
            return res.status(400).json({ error: "email or userType undefined" });
        }
        if (!roles.includes(userType)) {
            return res.status(400).json({ error: "invalid operation" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "User Not Found" })
        }

        if (rolesValue[loggedUser.userType] > rolesValue[userType]) {
            return res.status(400).json({ "error": `${loggedUser.userType} cannot assign role of ${userType}` })
        }
        else if (rolesValue[user.userType] <= rolesValue[loggedUser.userType]) {
            return res.status(400).json({ "error": `${loggedUser.userType} cannot change the role of ${user.userType}` })
        }

        user.userType = userType
        const updatedUser = await user.save()
        res.json(updatedUser)
    } catch (e) {
        res.status(500).send()
    }

}