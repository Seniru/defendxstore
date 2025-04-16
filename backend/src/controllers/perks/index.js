const { StatusCodes } = require("http-status-codes")
const createResponse = require("../../utils/createResponse")
const perkList = require("./list")

const getPerks = async (req, res, next) => {
    try {
        return createResponse(
            res,
            StatusCodes.OK,
            perkList.map((perk) => ({
                image: perk.image,
                title: perk.title,
                description: perk.description,
                maxProgress: perk.maxProgress,
                rewardText: perk.rewardText,
            })),
        )
    } catch (error) {
        next(error)
    }
}

module.exports = { getPerks }
