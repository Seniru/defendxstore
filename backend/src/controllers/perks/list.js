/**
 * format: { image, title, description, maxProgress, rewardText, rewardFunction(user) }
 * image: https://www.freepik.com/author/freepik/icons/special-flat_8
 * 	special-flat family
 */

const PromoCode = require("../../models/Promocodes")

module.exports = {
    verified: {
        image: "images/verified_badge.png",
        title: "Verified user",
        description: "Get verified",
        maxProgress: 1,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    firstPurchase: {
        image: "images/first_purchase.png",
        title: "First Purchase",
        description: "Complete your first order",
        maxProgress: 1,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    casualShopper: {
        image: "images/casual_shopper.png",
        title: "Casual Shopper",
        description: "Buy 5 items from the store",
        maxProgress: 5,
        rewardText: "5% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                5,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    roseEnthusiast: {
        image: "images/rose_badge.png",
        title: "Rose Enthusiast",
        description: "Buy 3 items from the Rose Collection",
        maxProgress: 3,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    referralRookie: {
        image: "images/referal_badge.png",
        title: "Referral Rookie",
        description: "Refer 1 friend who makes a purchase",
        maxProgress: 1,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    influencer: {
        image: "images/influencer_badge.png",
        title: "Influencer",
        description: "Refer 10 friends and have their accounts verified",
        maxProgress: 10,
        rewardText: "10% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    supportSeeker: {
        image: "images/support_seeker.png",
        title: "Support Seeker",
        description: "Submit 3 support tickets",
        maxProgress: 3,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    forumNewbie: {
        image: "images/forum_newbie.png",
        title: "Forum Newbie",
        description: "Create your first forum thread",
        maxProgress: 1,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    threadMaster: {
        image: "images/thread_master.png",
        title: "Thread Master",
        description: "Create 5 forum threads",
        maxProgress: 5,
        rewardText: "3% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                3,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    communityHelper: {
        image: "images/community_helper.png",
        title: "Community Helper",
        description: "Reply to 20 forum threads",
        maxProgress: 10,
        rewardText: "5% OFF promotion code",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                5,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
    test: {
        image: "",
        title: "Test",
        description: "",
        maxProgress: 15,
        rewardText: "",
        rewardFunction: async (user) => {
            const promocode = await PromoCode.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                5,
                user,
            )
            await user.pushNotification(
                `You've earned a perk! Use code ${promocode.promocode} at checkout.`,
            )
            return {
                type: "promocode",
                promocode: { code: promocode.promocode, validUntil: promocode.validuntil },
            }
        },
    },
}
