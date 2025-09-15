package com.gateway.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Valid
@ToString

public class PagingRequest extends BaseRequest{
    @Min(value = 0,message = "page index")
    private int pageIndex;

    @Min(value=1,message = "page size")
    private int pageSize;
}
