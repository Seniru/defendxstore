const { StatusCodes } = require("http-status-codes")
const createResponse = require("../../utils/createResponse")
const perkList = require("./list")
const User = require("../../models/User")
const PromoCode = require("../../models/Promocodes")

const getPerks = async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username }).exec()
    try {
        return createResponse(
            res,
            StatusCodes.OK,
            Object.entries(perkList).map(([perkKey, perk]) => ({
                id: perkKey,
                image: perk.image,
                title: perk.title,
                description: perk.description,
                progress: user.perks.get(perkKey)?.progress || 0,
                claimed: !!user.perks.get(perkKey)?.claimed,
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

const claimPerk = async (req, res, next) => {
    try {
        const { perk } = req.params
        const user = await User.findOne({ username: req.user.username }).exec()
        if (!user.verified)
            return createResponse(res, StatusCodes.FORBIDDEN, "You must be verified")
        if (!perkList[perk]) return createResponse(res, StatusCodes.NOT_FOUND, "Perk not found")

        const progress = user.perks.get(perk)
        if (!progress) return createResponse(res, StatusCodes.FORBIDDEN, "Progress not fulfilled")
        if (progress.progress < perkList[perk].maxProgress)
            return createResponse(res, StatusCodes.FORBIDDEN, "Progress not fulfilled")
        if (progress.claimed) return createResponse(res, StatusCodes.FORBIDDEN, "Already claimed")

        const rewardResult = await perkList[perk].rewardFunction(user)
        await User.updateOne({ _id: user._id }, { $set: { [`perks.${perk}.claimed`]: true } })
        return createResponse(res, StatusCodes.OK, rewardResult)
    } catch (error) {
        next(error)
    }
}

module.exports = { getPerks, testPerks, claimPerk }
