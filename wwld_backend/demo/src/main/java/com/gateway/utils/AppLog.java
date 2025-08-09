package com.gateway.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppLog {
    public static void debug(String logString) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.debug(logString);
    }

    public static void info(String logString) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.info(logString);
    }

    public static void clientLog(String logString) {
        Logger subLog = LoggerFactory.getLogger("com.tnd.gateway.v1_0.clientlog");
        subLog.info(logString);
    }

    public static void error(String logString) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.error("{} {} {} - {}", ste.getClassName(), ste.getMethodName(), ste.getLineNumber(), logString);

    }

    public static void error(Exception e) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.error("{} {} {}", ste.getClassName(), ste.getMethodName(), ste.getLineNumber());
        subLog.error("", e);
    }

    public static void error(String info, Exception e) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.error("{} {} {}", ste.getClassName(), ste.getMethodName(), ste.getLineNumber());
        subLog.error(info, e);
    }

    public static void fatal(String logString) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.error("{} {} {} - {}", ste.getClassName(), ste.getMethodName(), ste.getLineNumber(), logString);
    }

    public static void warning(String logString) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String clsName = ste.getClassName();
        Logger subLog = LoggerFactory.getLogger(clsName);
        if (subLog == null) {
            return;
        }
        subLog.warn("{} {} {} - {}", ste.getClassName(), ste.getMethodName(), ste.getLineNumber(), logString);

    }
}