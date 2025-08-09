package com.gateway.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import com.gateway.request.BaseRequest;
import com.gateway.response.ApiResult.Result;
import com.gateway.response.BaseResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public class BaseRsService {

    protected static BaseResponse getBase(BaseRequest request) {
        BaseResponse res = new BaseResponse();
        res.setResult(Result.OK);
        res.setResponseId(UUID.randomUUID().toString());
        return res;
    }

    protected Result buildResult(boolean isSuccess, String code, String msg) {
        return new Result() {

            @Override
            public boolean isOk() {
                return isSuccess;
            }

            @Override
            public String getMessage() {
                return msg;
            }

            @Override
            public String getCode() {
                return code;
            }
        };
    }






}