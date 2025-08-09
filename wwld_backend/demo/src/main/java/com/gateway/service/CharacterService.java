package com.gateway.service;


import com.gateway.bussiness.CharacterBusiness;
import com.gateway.request.CharacterRequest.GetCharacterRequest;
import com.gateway.request.DialogRequest.DialogRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.CharacterResponse.CharacterResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/characters")
public class CharacterService extends BaseFuntion{

    private static final Logger LOGGER = LoggerFactory.getLogger(CharacterService.class);


    @Autowired
    private CharacterBusiness characterBusiness; // Assuming you have a CharacterBusiness class to handle business logic

    // This class will handle character-related requests
    // You can define methods here to handle specific endpoints, e.g., getCharacter, createCharacter, etc.
    // For example:

    // @GetMapping("/{id}")
    // public ResponseEntity<CharacterDTO> getCharacter(@PathVariable Long id) {
    //     // Logic to retrieve character by ID
    // }

    // @PostMapping
    // public ResponseEntity<CharacterDTO> createCharacter(@RequestBody CharacterRequest request) {
    //     // Logic to create a new character
    // }

    @RequestMapping(value = "/getCharacters", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<CharacterResponse> getCharacters(@RequestBody GetCharacterRequest request) {
        CharacterResponse response = new CharacterResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                response.setListCharacters(characterBusiness.getCharacters(request));
            }else{
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while getting characters", e);
        };

        return new ResponseEntity<>(response, HttpStatus.OK);
    };

    @RequestMapping(value = "/insert", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<CharacterResponse> insert(@RequestBody GetCharacterRequest request) {
        CharacterResponse response = new CharacterResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                characterBusiness.createCharacter(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while inserting character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // update character
    @RequestMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<CharacterResponse> update(@RequestBody GetCharacterRequest request) {
        CharacterResponse response = new CharacterResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                characterBusiness.updateCharacter(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while updating character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // delete character
    @RequestMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<CharacterResponse> delete(@RequestBody GetCharacterRequest request) {
    CharacterResponse response = new CharacterResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                characterBusiness.deleteCharacter(request.getId());
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while deleting character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
