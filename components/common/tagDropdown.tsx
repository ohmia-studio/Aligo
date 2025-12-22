'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

import { TagItem } from '@/interfaces/news-interfaces';

interface Props {
  tags: TagItem[];
  value: string;
  onChange: (val: string) => void;
  onCreateTag: (tag: TagItem) => Promise<void>;
}

export function TagDropdown({ tags, value, onChange, onCreateTag }: Props) {
  const [newTag, setNewTag] = useState('');

  async function handleCreate() {
    if (!newTag.trim()) return;
    await onCreateTag({ nombre: newTag.trim() });
    onChange(newTag.trim());
    setNewTag('');
  }

  return (
    <>
      <Select name="tag" value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-base-color/5 w-[180px]">
          <SelectValue placeholder="Selecciona un tag" defaultValue={''} />
        </SelectTrigger>
        <SelectContent className="">
          <SelectGroup>
            <SelectLabel className="opacity-30">Tags existentes</SelectLabel>
            {tags.map((tag, index) => (
              <SelectItem
                key={index}
                about={tag.descripcion}
                value={tag.nombre}
              >
                {tag.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="opacity-30">Nuevo Tag</SelectLabel>
            <input
              className="bg-base-color/5 rounded px-2"
              placeholder="ingrese..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              className="rounded-md px-2 transition-all delay-300 duration-200 ease-in-out hover:bg-neutral-700"
              type="button"
              onClick={handleCreate}
            >
              Crear
            </button>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
