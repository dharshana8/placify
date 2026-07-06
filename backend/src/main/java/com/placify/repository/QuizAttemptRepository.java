package com.placify.repository;

import com.placify.model.QuizAttempt;
import com.placify.model.Quiz;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudent(Student student);
    Optional<QuizAttempt> findByQuizAndStudent(Quiz quiz, Student student);
    List<QuizAttempt> findByQuiz(Quiz quiz);
}
