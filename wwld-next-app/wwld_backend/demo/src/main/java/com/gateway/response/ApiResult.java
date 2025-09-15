package com.gateway.response;

import com.gateway.constant.AppConst;

public interface ApiResult<T> {

    public Result apiResult(T value);

    public static interface Result {

        public static final Result OK = new Result() {

            @Override
            public boolean isOk() {
                return true;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_SUCCESS;
            }

            @Override
            public String getMessage() {
                return "OK";
            }
        };

        public static final Result FAILD = new Result() {

            @Override
            public boolean isOk() {
                return false;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_FAIL;
            }

            @Override
            public String getMessage() {
                return "Transaction faild";
            }
        };

        public static final Result BAD = new Result() {

            @Override
            public boolean isOk() {
                return false;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_BADREQUEST;
            }

            @Override
            public String getMessage() {
                return "Request invalid";
            }
        };
        public static final Result NOT_FOUND = new Result() {

            @Override
            public boolean isOk() {
                return false;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_NOTFOUND;
            }

            @Override
            public String getMessage() {
                return "This method isn't supported";
            }
        };

        public static final Result INVALID = new Result() {

            @Override
            public boolean isOk() {
                return false;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_ARGS_INVALID;
            }

            @Override
            public String getMessage() {
                return "Request argument not valid";
            }
        };

        public static final Result EXCEPTION = new Result() {

            @Override
            public boolean isOk() {
                return false;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_EXCEPTION;
            }

            @Override
            public String getMessage() {
                return "An error occurred, Please try again later or contact to admin for detail";
            }
        };
        public static final Result PASS = new Result() {

            @Override
            public boolean isOk() {
                return true;
            }

            @Override
            public String getCode() {
                return AppConst.CODE_PASS;
            }

            @Override
            public String getMessage() {
                return "PASS";
            }
        };

        public boolean isOk();

        public String getCode();

        public String getMessage();
    }
}