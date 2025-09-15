package com.gateway.constant;

import java.io.FileInputStream;
import java.util.Properties;

import com.gateway.utils.AppLog;

public class AppConst {
    public static String IS_PROD;
    // Result code
    public static final String CODE_SUCCESS = "00";
    public static final String CODE_EXCEPTION = "000";

    public static final String CODE_PASS = "0000";
    public static final String CODE_FAIL = "900";
    public static final String CODE_BADREQUEST = "901";
    public static final String CODE_NOTFOUND = "902";
    public static final String CODE_ARGS_INVALID = "903";
    // Validate code
    public static final String CODE_INVALID_NULL = "700";
    public static final String CODE_INVALID_EMPTY = "701";
    public static final String CODE_INVALID_MAX = "702";
    public static final String CODE_INVALID_MIN = "703";
    public static final String CODE_INVALID_FORMAT = "704";
    public static final String CODE_INVALID_RANGE = "705";
    public static final String CODE_INVALID_UNKNOWN = "706";
    public static final String CODE_INVALID_MINLENGTH = "707";
    public static final String CODE_INVALID_MAXLENGTH = "708";
    // Feature status
    public static final String STATUS_FEATURE_ACTIVE = "A";
    public static final String STATUS_FEATURE_INACTIVE = "IA";
    // Custom result code
    public static final String CODE_ERROR_NOT_EXIST = "800";
    public static final String CODE_ERROR_EXISTED = "801";
    public static final String CODE_ERROR_PAGING = "802";
    public static final String CODE_ERROR_APPROVED = "803";
    public static final String NOT_MATCH_CURRENT_PASS = "804";
    public static final String CODE_ERROR_PERMISSION = "805";

    public static final String EMPTY_STR = "";

    public static String UPLOADFILE_LOCATION;

    // send email config
    public static String SEND_EMAIL_HOST;
    public static String SEND_EMAIL_PORT;
    public static String SEND_EMAIL_USER;
    public static String SEND_EMAIL_PASS;
    public static int THREAD_SEND_EMAIL_NUMBER;

    // load config file
    private static Properties properties = new Properties();
    static {
        loadProperties();
    }
    public static void loadProperties() {
        try {
            String fileName = "./conf/dev";
            FileInputStream propsFile = new FileInputStream(fileName);
            properties.load(propsFile);
            IS_PROD = getStringProperty("IS_PROD", "N");
            UPLOADFILE_LOCATION = getStringProperty("UPLOADFILE_LOCATION", "");
            SEND_EMAIL_HOST = getStringProperty("SEND_EMAIL_HOST", "");
            SEND_EMAIL_PORT = getStringProperty("SEND_EMAIL_PORT", "");
            SEND_EMAIL_USER = getStringProperty("SEND_EMAIL_USER", "");
            SEND_EMAIL_PASS = getStringProperty("SEND_EMAIL_PASS", "");
            THREAD_SEND_EMAIL_NUMBER = getIntProperty("THREAD_SEND_EMAIL_NUMBER", 5);
            propsFile.close();
        } catch (Exception e) {
            AppLog.error(e);
        }
    }
    public static String getStringProperty(String propName, String defaultValue) {
        return properties.getProperty(propName, defaultValue);
    }

    public static int getIntProperty(String propName, int defaultValue) {
        return Integer.parseInt(properties.getProperty(propName, Integer.toString(defaultValue)));
    }

    public static long getLongProperty(String propName, long defaultValue) {
        return Long.parseLong(properties.getProperty(propName, Long.toString(defaultValue)));
    }

    public static double getDoubleProperty(String propName, double defaultValue) {
        return Double.parseDouble(properties.getProperty(propName, Double.toString(defaultValue)));
    }
}