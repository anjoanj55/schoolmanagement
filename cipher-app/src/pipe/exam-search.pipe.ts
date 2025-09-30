import { Pipe, PipeTransform } from '@angular/core';
import { Exam } from '../app/pages/examdates/examdates.component'; // ✅ adjust if needed

@Pipe({
  name: 'examSearch',
  standalone: true
})
export class ExamSearchPipe implements PipeTransform {
  transform(exams: Exam[], searchText: string): Exam[] {
    if (!exams) return [];
    if (!searchText) return exams;

    const lower = searchText.toLowerCase();
    return exams.filter(exam =>
      (exam.exam_name?.toLowerCase().includes(lower)) ||
      (exam.exam_date?.toLowerCase().includes(lower)) ||
      (exam.start_time?.toLowerCase().includes(lower)) ||
      (exam.end_time?.toLowerCase().includes(lower)) ||
      (exam.day?.toLowerCase().includes(lower))
    );
  }
}
