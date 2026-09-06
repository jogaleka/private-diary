package com.diary.backend;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diary")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://write-your-mind.onrender.com"
})
public class DiaryController {

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @PostMapping
    public DiaryEntry createEntry(
            @RequestAttribute("userEmail") String userEmail,
            @RequestBody DiaryRequest request
    ) {
        return diaryService.createEntry(
                userEmail,
                request.title(),
                request.content()
        );
    }

    @GetMapping
    public List<DiaryEntry> getMyEntries(
            @RequestAttribute("userEmail") String userEmail
    ) {
        return diaryService.getMyEntries(userEmail);
    }

    public record DiaryRequest(
            String title,
            String content
    ) {
    }

    @GetMapping("/{id}")
    public DiaryEntry getEntry(
            @PathVariable Long id,
            @RequestAttribute("userEmail") String userEmail
    ) {
        return diaryService.getEntry(id, userEmail);
    }

    @PutMapping("/{id}")
    public DiaryEntry updateEntry(
            @PathVariable Long id,
            @RequestAttribute("userEmail") String userEmail,
            @RequestBody DiaryRequest request
    ) {
        return diaryService.updateEntry(
                id,
                userEmail,
                request.title(),
                request.content()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(
            @PathVariable Long id,
            @RequestAttribute("userEmail") String userEmail
    ) {
        diaryService.deleteEntry(id, userEmail);
    }
}