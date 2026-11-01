export interface StudentInput {
  name: string;
  email: string;
  course: string;
  age: number;
}

export function validateStudent(
  data: unknown
): StudentInput | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const input = data as Record<string, unknown>;

  const name = input.name;
  const email = input.email;
  const course = input.course;
  const age = input.age;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof course !== "string" ||
    !Number.isInteger(age)
  ) {
    return null;
  }

  if (
    name.trim().length < 2 ||
    name.trim().length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    email.trim().length > 150 ||
    course.trim().length < 2 ||
    course.trim().length > 100 ||
    (age as number) < 1 ||
    (age as number) > 120
  ) {
    return null;
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    course: course.trim(),
    age: age as number,
  };
}
