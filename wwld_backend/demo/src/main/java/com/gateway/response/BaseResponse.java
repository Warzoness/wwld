package com.gateway.response;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class BaseResponse {
    private String responseId;
    private ApiResult.Result result;
    private String userId;

    public void setBaseResponse(BaseResponse response) {
        this.responseId = response.getResponseId();
        this.result = response.getResult();
    }

    @Override
    public String toString() {
        return "BaseResponse [responseId=" + responseId + ", result={code:" + result.getCode() + ", message:" + result.getMessage() + "}]";
    }
}
