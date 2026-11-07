import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonPlayer } from '@/components/lesson/lesson-player';
import { getLesson, lessons } from '@/lib/data';

export function generateStaticParams() {
    return lessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const lesson = getLesson(id);
    return lesson
        ? { title: `${lesson.title} · ${lesson.place.en}`, description: lesson.description }
        : { title: 'Lesson not found' };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!getLesson(id)) notFound();
    return <LessonPlayer lessonId={id} />;
}
