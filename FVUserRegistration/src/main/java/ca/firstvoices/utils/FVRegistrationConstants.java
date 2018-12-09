package ca.firstvoices.utils;

public class FVRegistrationConstants {
    // Registration process ACTIONS constants - NOT timeouts
    public static final int MID_REGISTRATION_PERIOD_ACT = 1;
    public static final int REGISTRATION_EXPIRATION_ACT = 2;
    public static final int REGISTRATION_DELETION_ACT = 3;
    public static final int NEW_USER_SELF_REGISTRATION_ACT = 5;

    // constants for Group and User update operations
    public static final String APPEND = "append";
    public static final String UPDATE = "update";
    public static final String REMOVE = "remove";


    // TODO - adjust registration constants here
    // TODO - all values in days
    public static final int MID_REGISTRATION_PERIOD_IN_DAYS = 4;
    public static final int REGISTRATION_EXPIRATION_IN_DAYS = 7;
    public static final int REGISTRATION_DELETION_IN_DAYS = 8;
}
