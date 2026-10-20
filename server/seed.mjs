import { calculateRisk } from './risk.mjs';
const now = '2026-10-20T10:00:00.000Z';
const names = [
 ['ЖК Самал','ТОО Demo Development','630000000001','Усть-Каменогорск, demo-адрес 1','Строительство','2027-09'],
 ['ЖК Алтай Residence','ТОО Altai Demo','630000000002','Усть-Каменогорск, demo-адрес 2','Котлован','2028-03'],
 ['ЖК Иртыш Park','ТОО Irtysh Demo','630000000003','Усть-Каменогорск, demo-адрес 3','Монолитные работы','2027-12'],
 ['ЖК Восток','ТОО Vostok Demo','630000000004','Усть-Каменогорск, demo-адрес 4','Отделка','2026-12'],
 ['ЖК Көктем','ТОО Koktem Demo','630000000005','Усть-Каменогорск, demo-адрес 5','Строительство','2028-06'],
 ['ЖК Орман','ТОО Orman Demo','630000000006','Усть-Каменогорск, demo-адрес 6','Подготовка площадки','2028-09'],
 ['ЖК Нұрлы','ТОО Nurly Demo','630000000007','Усть-Каменогорск, demo-адрес 7','Монтаж конструкций','2027-06'],
 ['ЖК Береке','ТОО Bereke Demo','630000000008','Усть-Каменогорск, demo-адрес 8','Ввод в эксплуатацию','2026-11']
];
const projects = names.map((n,i)=>({id:`P${String(i+1).padStart(3,'0')}`,name:n[0],developer:n[1],bin:n[2],address:n[3],stage:n[4],completion:n[5],readiness:null,legalBasis:i===2?'Разрешение (демо-сведения)':i===3?'Гарантия (демо-сведения)':'Нет данных',legalStatus:i===2||i===3?'requires_review':'unknown',sources:[{name:'Демонстрационный набор',url:'',capturedAt:now}],demo:true}));
const postTexts = [
 'Продажа квартир в ЖК Самал на этапе строительства. Планируемая сдача в 2027 году.',
 'Бронируйте квартиру в ЖК Самал сегодня: депозит 300 000 тенге для фиксации цены.',
 'Старт продаж в ЖК Алтай Residence. Первоначальный взнос от 20%, подробности в личных сообщениях.',
 'ЖК Иртыш Park: квартиры на этапе монолитных работ, оставьте заявку на консультацию.',
 'Специальное предложение: платная бронь квартиры в ЖК Восток, сумма брони 150 000 ₸.',
 'Квартиры в ЖК Көктем. Продажи открыты, доступна рассрочка от застройщика.',
 'ЖК Орман: раннее бронирование квартир. Для резерва требуется депозит.',
 'В ЖК Нұрлы продолжается строительство. Запишитесь на просмотр планировок.',
 'ЖК Береке, финальные квартиры. Объект готовится к вводу, уточняйте детали.',
 'Акция на квартиры в ЖК Алтай Residence: внесите первоначальный взнос до конца недели.',
 'ЖК Самал: онлайн-презентация проекта и выбор планировки. Условия по запросу.',
 'Квартиры в ЖК Иртыш Park: оставьте заявку, чтобы получить коммерческое предложение.'
];
const posts = postTexts.map((text,i)=>({id:`A${String(i+1).padStart(3,'0')}`,source:['Instagram','Публичная страница','Сайт застройщика'][i%3],author:null,date:`2026-10-${String(2+i).padStart(2,'0')}`,url:'',text,projectId:['P001','P001','P002','P003','P004','P005','P006','P007','P008','P002','P001','P003'][i],status:'new',analysis:null,capturedAt:now,demo:true}));
function factor(status, evidence='', reason='') { return {status,evidence,reason,updatedAt:now,updatedBy:'Демо-аналитик'}; }
const factorsA={R1:factor('pending'),R2:factor('confirmed','депозит 300 000 тенге для фиксации цены'),R3:factor('confirmed','Продажа квартир в ЖК Самал на этапе строительства'),R4:factor('pending'),R5:factor('pending'),R6:factor('pending')};
const factorsB={R1:factor('confirmed','Сценарий B: в демонстрации отсутствие основания подтверждено проверочными данными'),R2:factor('confirmed','внесите первоначальный взнос до конца недели'),R3:factor('confirmed','Старт продаж в ЖК Алтай Residence'),R4:factor('pending'),R5:factor('pending'),R6:factor('pending')};
const factorsC={R1:factor('rejected','','Демо-сценарий: законное основание подтверждено'),R2:factor('pending'),R3:factor('confirmed','ЖК Иртыш Park: квартиры на этапе монолитных работ'),R4:factor('pending'),R5:factor('pending'),R6:factor('pending')};
const signals=[
 {id:'S001',projectId:'P001',postId:'A002',description:'Предложение платного депозита при продаже жилья на этапе строительства.',factors:factorsA,status:'pending',createdAt:now,history:[{at:now,actor:'Система',action:'Создан демонстрационный сигнал'}],demo:true},
 {id:'S002',projectId:'P002',postId:'A010',description:'Демонстрационный контрастный сценарий с подтверждёнными R1, R2 и R3.',factors:factorsB,status:'confirmed',createdAt:now,history:[{at:now,actor:'Демо-аналитик',action:'Подтверждён демонстрационный сценарий'}],demo:true},
 {id:'S003',projectId:'P003',postId:'A004',description:'Демонстрационный сценарий: подтверждена активная реклама, законное основание не признано отсутствующим.',factors:factorsC,status:'review',createdAt:now,history:[{at:now,actor:'Система',action:'Создан демонстрационный сигнал'}],demo:true}
].map(s=>({...s,...calculateRisk(s.factors)}));
export function createSeed(){ return {projects,posts,signals,events:[],meta:{seededAt:now,version:1}}; }
