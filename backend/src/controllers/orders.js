const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).exec()
        return createResponse(res, StatusCodes.OK, orders)
    } catch (error) {
        next(error)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const { cart } = req.body;

        if (!Array.isArray(cart)) {
            //throw new Error("Invalid cart data. Cart must be an array.");
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid cart data. Cart must be an array.");
        }

        if (cart.length === 0) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Cart is empty.");
        }

        console.log("Cart has items:", cart);

        const order = new Order(req.body);
        await order.save();
        return createResponse(res, StatusCodes.CREATED, order);
    } catch (error) {
        next(error);
    }
}
    const getOrder = async (req, res, next) => {
        try {
            const { order } = req.params
            const user = req.user
            if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "order not found")
            
            if (!user.roles.include("DELIVERY_AGENT") && user.username !== order.username)
                return createResponse(
                    res,
                    StatusCodes.FORBIDDEN,
                    "You are not authorized to access this order",
                )
    
            return createResponse(res, StatusCodes.OK, { order })
        } catch (error) {
            next(error)
        }
    }

    const deleteorder = async (req, res, next) => {
        try {
            const { order } = req.params
            if (!req.user.roles.includes("ADMIN") && username !== req.user.username)
                return createResponse(res, StatusCodes.FORBIDDEN, "You cannot delete this order")
    
            const orders = await User.findOneAndDelete({ order }).exec()
            if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "order not found")
            return createResponse(res, StatusCodes.OK, "User deleted")
        } catch (error) {
            next(error)
        }
    }

    





module.exports = {
    getOrders,
    createOrder,
    getOrder
}