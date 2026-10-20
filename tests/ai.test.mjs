import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePublication } from '../server/ai.mjs';
test('Пустая публикация отклоняется до обращения к API',async()=>{await assert.rejects(()=>analyzePublication('   ',{}),e=>e.status===400)});
test('Без ключа честно возвращается ошибка настройки',async()=>{await assert.rejects(()=>analyzePublication('Продажа квартиры',{AI_API_KEY:''}),e=>e.status===503&&e.message.includes('не настроен'))});
