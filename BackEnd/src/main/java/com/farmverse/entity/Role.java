package com.farmverse.entity;

public enum Role {
    ADMIN,
    FARM_MANAGER,
    GUEST;

    public static boolean isValid(String role) {
        if (role == null) {
            return false;
        }
        String normalized = role.trim().toUpperCase().replace(" ", "_");
        for (Role r : values()) {
            if (r.name().equals(normalized)) {
                return true;
            }
        }
        return false;
    }

    public static String normalize(String role) {
        if (role == null) {
            return GUEST.name();
        }
        String normalized = role.trim().toUpperCase().replace(" ", "_");
        for (Role r : values()) {
            if (r.name().equals(normalized)) {
                return r.name();
            }
        }
        return normalized;
    }
}
