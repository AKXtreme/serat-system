package com.serat.system.common.constant;


public class UserConstants
{
    public static final String SYS_USER = "SYS_USER";

    /** Normal Status */
    public static final String NORMAL = "0";

    /** Exception Status */
    public static final String EXCEPTION = "1";

    /** User Disabled Status */
    public static final String USER_DISABLE = "1";

    /** Role Normal Status */
    public static final String ROLE_NORMAL = "0";

    /** Role Disabled Status */
    public static final String ROLE_DISABLE = "1";

    /** Department Normal Status */
    public static final String DEPT_NORMAL = "0";

    /** Department Disabled Status */
    public static final String DEPT_DISABLE = "1";

    /** Dictionary Normal Status */
    public static final String DICT_NORMAL = "0";

    /** Is System Default (Yes) */
    public static final String YES = "Y";

    /** Is Menu External Link (Yes) */
    public static final String YES_FRAME = "0";

    /** Is Menu External Link (No) */
    public static final String NO_FRAME = "1";

    /** Menu Type (Directory) */
    public static final String TYPE_DIR = "M";

    /** Menu Type (Menu) */
    public static final String TYPE_MENU = "C";

    /** Menu Type (Button) */
    public static final String TYPE_BUTTON = "F";

    /** Layout Component Identifier */
    public final static String LAYOUT = "Layout";

    /** ParentView Component Identifier */
    public final static String PARENT_VIEW = "ParentView";

    /** InnerLink Component Identifier */
    public final static String INNER_LINK = "InnerLink";

    /** Validation Return Flag for Uniqueness */
    public final static boolean UNIQUE = true;
    public final static boolean NOT_UNIQUE = false;

    /** Username Length Limit */
    public static final int USERNAME_MIN_LENGTH = 2;
    public static final int USERNAME_MAX_LENGTH = 20;

    /** Password Length Limit */
    public static final int PASSWORD_MIN_LENGTH = 5;
    public static final int PASSWORD_MAX_LENGTH = 20;
}
