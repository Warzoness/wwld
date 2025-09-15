package com.gateway.spec;


import com.gateway.entity.GameCharacter;
import org.springframework.data.jpa.domain.Specification;


public final class CharacterSpecs {
    private CharacterSpecs() {}


    public static Specification<GameCharacter> hasId(Long id) {
        return (root, query, cb) -> id == null ? null : cb.equal(root.get("id"), id);
    }


    public static Specification<GameCharacter> nameContains(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) return null;
            return cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }


    public static Specification<GameCharacter> hasRank(Long rank) {
        return (root, query, cb) -> rank == null ? null : cb.equal(root.get("characterRank"), rank);
    }


    public static Specification<GameCharacter> isLimited(Boolean limited) {
        return (root, query, cb) -> limited == null ? null : cb.equal(root.get("isLimited"), limited);
    }
}