import technologies from '@devstack/data/technologies.json';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Section = {
  id: string;
  category: string;
  technologies: { id: string; name: string; href: string }[];
};

const HomePage: NextPage = () => {
  const sections = technologies as Section[];

  const [sectionIndex, setSectionIndex] = useState(0);
  const [techIndex, setTechIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const currentSection = sections[sectionIndex];
      const techCount = currentSection.technologies.length;

      switch (e.key) {
        case 'ArrowDown':
          setSectionIndex((i) => {
            const next = Math.min(i + 1, sections.length - 1);
            if (next !== i) setTechIndex(0); // ✅ reset tech index
            return next;
          });
          break;

        case 'ArrowUp':
          setSectionIndex((i) => {
            const next = Math.max(i - 1, 0);
            if (next !== i) setTechIndex(0); // ✅ reset tech index
            return next;
          });
          break;

        case 'ArrowRight':
          setTechIndex((i) => Math.min(i + 1, techCount - 1));
          break;

        case 'ArrowLeft':
          setTechIndex((i) => Math.max(i - 1, 0));
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sectionIndex, sections]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Sections container */}
      <div
        className="absolute left-0 w-full transition-[top] duration-500 ease-out"
        style={{
          top: `-${sectionIndex * 100}vh`,
        }}>
        {sections.map(({ id, category, technologies }, sIndex) => (
          <section
            key={id}
            className="flex h-screen w-screen items-center justify-center font-bold">
            <div className="flex flex-col gap-y-8">
              <h1 className="text-center text-4xl">
                {sIndex + 1}. {category}
              </h1>

              {/* Technology viewport */}
              <div className="relative mx-auto h-32 w-152 overflow-hidden">
                <div
                  className="absolute top-0 flex h-32 w-full items-center gap-x-8 transition-[left] duration-300 ease-out"
                  style={{
                    left: `-${techIndex * 8}rem`, // 8rem ≈ card width + gap
                  }}>
                  {technologies.map(({ id, name, href }) => (
                    <div key={id} className="flex w-24 flex-col gap-y-4">
                      <div className="mx-auto aspect-square w-24 rounded-md border border-gray-700 shadow-xl" />
                      <Link
                        href={href}
                        target="_blank"
                        className="truncate text-center text-xs">
                        {name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional indicator */}
              <p className="text-center text-xs opacity-60">
                ← → technologies • ↑ ↓ sections
              </p>
            </div>
          </section>
        ))}
      </div>

      <div className="absolute top-0 right-8 bottom-0 my-auto flex h-16 w-8 items-center justify-center rounded-full border border-gray-700">
        <div className="relative h-12 w-4 overflow-hidden">
          <div
            className="absolute right-0 left-0"
            style={{
              // center the active dot in the container
              top: 16 - sectionIndex * 16,
            }}>
            <div className="flex flex-col items-center justify-start gap-y-2">
              {sections.map(({ id, category }, sIndex) => (
                <div
                  key={id}
                  title={`${sIndex}. ${category}`}
                  data-tip={`${sIndex}. ${category}`}
                  className={`z-100 rounded-full transition-all duration-300 ${
                    sectionIndex === sIndex
                      ? 'h-4 w-4 bg-white'
                      : 'h-2 w-2 bg-gray-700'
                  }`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
