package com.diary.backend;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final UserRepository userRepository;

    public DiaryService(
            DiaryEntryRepository diaryEntryRepository,
            UserRepository userRepository
    ) {
        this.diaryEntryRepository = diaryEntryRepository;
        this.userRepository = userRepository;
    }

    public DiaryEntry createEntry(
            String userEmail,
            String title,
            String content
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiaryEntry entry = new DiaryEntry();
        entry.setUser(user);
        entry.setTitle(title);
        entry.setContent(content);

        return diaryEntryRepository.save(entry);
    }

    public List<DiaryEntry> getMyEntries(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return diaryEntryRepository.findByUserId(user.getId());
    }

    public DiaryEntry getEntry(Long entryId, String userEmail) {
        DiaryEntry entry = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found"));

        if (!entry.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        return entry;
    }

    public DiaryEntry updateEntry(
        Long entryId,
        String userEmail,
        String title,
        String content
    ) {
        DiaryEntry entry = getEntry(entryId, userEmail);

        entry.setTitle(title);
        entry.setContent(content);

        return diaryEntryRepository.save(entry);
    }

    public void deleteEntry(Long entryId, String userEmail) {
        DiaryEntry entry = getEntry(entryId, userEmail);

        diaryEntryRepository.delete(entry);
    }
}