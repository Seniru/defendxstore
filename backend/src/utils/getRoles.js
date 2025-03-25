const permissions = {
    USER: 1 << 0,
    DELIVERY_AGENT: 1 << 1,
    SUPPORT_AGENT: 1 << 2,
    ADMIN: 1 << 3,
}

module.exports = {
    roles: permissions,
    getRoles: (roleBits) => {
        let userRoles = []
        for (let [role, bit] of Object.entries(permissions)) {
            if (roleBits & bit) userRoles.push(role)
        }
        return userRoles
    },
}
