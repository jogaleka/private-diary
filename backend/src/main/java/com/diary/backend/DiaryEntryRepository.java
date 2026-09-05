package com.diary.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryEntryRepository
        extends JpaRepository<DiaryEntry, Long> {

    List<DiaryEntry> findByUserId(Long userId);
}