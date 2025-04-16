const { StatusCodes } = require("http-status-codes")
const createResponse = require("../../utils/createResponse")
const perkList = require("./list")
const User = require("../../models/User")

const getPerks = async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username }).exec()
    try {
        return createResponse(
            res,
            StatusCodes.OK,
            Object.entries(perkList).map(([perkKey, perk]) => ({
                image: perk.image,
                title: perk.title,
                description: perk.description,
                progress: user.perks.get(perkKey)?.progress || 0,
                maxProgress: perk.maxProgress,
                rewardText: perk.rewardText,
            })),
        )
    } catch (error) {
        next(error)
    }
}

const testPerks = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        console.log(user)
        await user.incrementProgress("test")
        return createResponse(res, StatusCodes.OK, "OK")
    } catch (error) {
        next(error)
    }
}

module.exports = { getPerks, testPerks }
