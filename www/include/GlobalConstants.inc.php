<?php
abstract class STATUS_CODE {
	const SUCCESS_NORMAL = 1;
    const SUCCESS_WITH_MULTIPLE_RECORDS = 2;
	const DEFAULT_FAIL = 0;
	const UNSUPPORT_FAIL = -1;
    const FAIL_WITH_LOCAL_NO_RECORD = -2;
}

const CASE_STATUS = array(
    "A" => "初審",
    "B" => "複審",
    "H" => "公告",
    "I" => "補正",
    "R" => "登錄",
    "C" => "校對",
    "U" => "異動完成",
    "F" => "結案",
    "X" => "補正初核",
    "Y" => "駁回初核",
    "J" => "撤回初核",
    "K" => "撤回",
    "Z" => "歸檔",
    "N" => "駁回",
    "L" => "公告初核",
    "E" => "請示",
    "D" => "展期"
);

const REG_NOTE = array(
    "B" => "登錄開始",
    "R" => "登錄完成",
    "C" => "校對結束",
    "E" => "校對有誤",
    "S" => "異動開始",
    "F" => "異動完成",
    "G" => "異動有誤",
    "P" => "競合暫停"
);

const VAL_NOTE = array(
    "0" => "登記移案",
    "B" => "登錄中",
    "R" => "登錄完成",
    "D" => "校對完成",
    "C" => "校對中",
    "E" => "校對有誤",
    "S" => "異動開始",
    "F" => "異動完成",
    "G" => "異動有誤"
);


const OFFICE = array(
    "HA" => "桃園",
    "HB" => "中壢",
    "HC" => "大溪",
    "HD" => "楊梅",
    "HE" => "蘆竹",
    "HF" => "八德",
    "HG" => "平鎮",
    "HH" => "龜山",
    'AA' => '古亭',
    'AB' => '建成',
    'AC' => '中山',
    'AD' => '松山',
    'AE' => '士林',
    'AF' => '大安',
    'BA' => '中山',
    'BB' => '中正',
    'BC' => '中興',
    'BD' => '豐原',
    'BE' => '大甲',
    'BF' => '清水',
    'BG' => '東勢',
    'BH' => '雅潭',
    'BI' => '大里',
    'BJ' => '太平',
    'BK' => '龍井',
    'CB' => '信義',
    'CC' => '安樂',
    'DA' => '台南',
    'DB' => '安南',
    'DC' => '東南',
    'DD' => '鹽水',
    'DE' => '白河',
    'DF' => '麻豆',
    'DG' => '佳里',
    'DH' => '新化',
    'DI' => '歸仁',
    'DJ' => '玉井',
    'DK' => '永康',
    'EA' => '鹽埕',
    'EB' => '新興',
    'EC' => '前鎮',
    'ED' => '三民',
    'EE' => '楠梓',
    'EF' => '岡山',
    'EG' => '鳳山',
    'EH' => '旗山',
    'EI' => '仁武',
    'EJ' => '路竹',
    'EK' => '美濃',
    'EL' => '大寮',
    'FA' => '板橋',
    'FB' => '新莊',
    'FC' => '新店',
    'FD' => '汐止',
    'FE' => '淡水',
    'FF' => '瑞芳',
    'FG' => '三重',
    'FH' => '中和',
    'FI' => '樹林',
    'GA' => '羅東',
    'GB' => '宜蘭',
    'IA' => '嘉義市',
    'JB' => '竹北',
    'JC' => '竹東',
    'JD' => '新湖',
    'KA' => '大湖',
    'KB' => '苗栗',
    'KC' => '通霄',
    'KD' => '竹南',
    'KE' => '銅鑼',
    'KF' => '頭份',
    'MA' => '南投',
    'MB' => '草屯',
    'MC' => '埔里',
    'MD' => '竹山',
    'ME' => '水里',
    'NA' => '彰化',
    'NB' => '和美',
    'NC' => '鹿港',
    'ND' => '員林',
    'NE' => '田中',
    'NF' => '北斗',
    'NG' => '二林',
    'NH' => '溪湖',
    'OA' => '新竹市',
    'PA' => '斗六',
    'PB' => '斗南',
    'PC' => '西螺',
    'PD' => '虎尾',
    'PE' => '北港',
    'PF' => '台西',
    'QB' => '朴子',
    'QC' => '大林',
    'QD' => '水上',
    'QE' => '竹崎',
    'TA' => '屏東',
    'TB' => '里港',
    'TC' => '潮州',
    'TD' => '東港',
    'TE' => '恆春',
    'TF' => '枋寮',
    'UA' => '花蓮',
    'UB' => '鳳林',
    'UC' => '玉里',
    'VA' => '台東',
    'VB' => '成功',
    'VC' => '關山',
    'VD' => '太麻里',
    'WA' => '金門',
    'XA' => '澎湖',
    'ZA' => '連江'
);

const REG_WORD = array(
	"HA81" => "桃資登",
	"HA82" => "桃資總",
	"HA83" => "桃資更",
	"HA85" => "桃資速",
	"HA87" => "桃資標",
	"HAB1" => "壢桃登跨",
	"HAC1" => "溪桃登跨",
	"HAD1" => "楊桃登跨",
	"HAE1" => "蘆桃登跨",
	"HAF1" => "德桃登跨",
	"HAG1" => "平桃登跨",
	"HAH1" => "山桃登跨",
	"HBA1" => "桃壢登跨",
	"HCA1" => "桃溪登跨",
	"HDA1" => "桃楊登跨",
	"HEA1" => "桃蘆登跨",
	"HFA1" => "桃德登跨",
	"HGA1" => "桃平登跨",
	"HHA1" => "桃山登跨",
	"HB04" => "壢登",
	"HB06" => "壢速",
	"HFB1" => "壢德登跨",
	"HCB1" => "壢溪登跨",
	"HGB1" => "壢平登跨",
	"HDB1" => "壢楊登跨",
	"HBG1" => "平壢登跨",
	"HBE1" => "蘆壢登跨",
	"HBH1" => "山壢登跨",
	"HEB1" => "蘆壢登跨",
	"HBF1" => "德壢登跨",
	"HB05" => "壢永",
	"HHB1" => "壢山登跨",
	"HBD1" => "楊壢登跨",
    "HBC1" => "溪壢登跨",
    // 跨縣市
    'A1HB' => '跨縣市（古亭中壢）',
    'A2HB' => '跨縣市（建成中壢）',
    'A3HB' => '跨縣市（中山中壢）',
    'A4HB' => '跨縣市（松山中壢）',
    'A5HB' => '跨縣市（士林中壢）',
    'A6HB' => '跨縣市（大安中壢）',
    'B1HB' => '跨縣市（中山中壢）',
    'B2HB' => '跨縣市（中正中壢）',
    'B3HB' => '跨縣市（中興中壢）',
    'B4HB' => '跨縣市（豐原中壢）',
    'B5HB' => '跨縣市（大甲中壢）',
    'B6HB' => '跨縣市（清水中壢）',
    'B7HB' => '跨縣市（東勢中壢）',
    'B8HB' => '跨縣市（雅潭中壢）',
    'B9HB' => '跨縣市（大里中壢）',
    'BZHB' => '跨縣市（太平中壢）',
    'BYHB' => '跨縣市（龍井中壢）',
    'C1HB' => '跨縣市（信義中壢）',
    'C2HB' => '跨縣市（安樂中壢）',
    'D1HB' => '跨縣市（台南中壢）',
    'D2HB' => '跨縣市（安南中壢）',
    'D3HB' => '跨縣市（東南中壢）',
    'D4HB' => '跨縣市（鹽水中壢）',
    'D5HB' => '跨縣市（白河中壢）',
    'D6HB' => '跨縣市（麻豆中壢）',
    'D7HB' => '跨縣市（佳里中壢）',
    'D8HB' => '跨縣市（新化中壢）',
    'D9HB' => '跨縣市（歸仁中壢）',
    'DZHB' => '跨縣市（玉井中壢）',
    'DYHB' => '跨縣市（永康中壢）',
    'E1HB' => '跨縣市（鹽埕中壢）',
    'E2HB' => '跨縣市（新興中壢）',
    'E3HB' => '跨縣市（前鎮中壢）',
    'E4HB' => '跨縣市（三民中壢）',
    'E5HB' => '跨縣市（楠梓中壢）',
    'E6HB' => '跨縣市（岡山中壢）',
    'E7HB' => '跨縣市（鳳山中壢）',
    'E8HB' => '跨縣市（旗山中壢）',
    'E9HB' => '跨縣市（仁武中壢）',
    'EZHB' => '跨縣市（路竹中壢）',
    'EYHB' => '跨縣市（美濃中壢）',
    'EXHB' => '跨縣市（大寮中壢）',
    'F1HB' => '跨縣市（板橋中壢）',
    'F2HB' => '跨縣市（新莊中壢）',
    'F3HB' => '跨縣市（新店中壢）',
    'F4HB' => '跨縣市（汐止中壢）',
    'F5HB' => '跨縣市（淡水中壢）',
    'F6HB' => '跨縣市（瑞芳中壢）',
    'F7HB' => '跨縣市（三重中壢）',
    'F8HB' => '跨縣市（中和中壢）',
    'F9HB' => '跨縣市（樹林中壢）',
    'G1HB' => '跨縣市（羅東中壢）',
    'G2HB' => '跨縣市（宜蘭中壢）',
    'H1AA' => '跨縣市（桃園古亭）',
    'H2AA' => '跨縣市（中壢古亭）',
    'H3AA' => '跨縣市（大溪古亭）',
    'H4AA' => '跨縣市（楊梅古亭）',
    'H5AA' => '跨縣市（蘆竹古亭）',
    'H6AA' => '跨縣市（八德古亭）',
    'H7AA' => '跨縣市（平鎮古亭）',
    'H8AA' => '跨縣市（龜山古亭）',
    'I1HB' => '跨縣市（嘉義市中壢）',
    'J1HB' => '跨縣市（竹北中壢）',
    'J2HB' => '跨縣市（竹東中壢）',
    'J3HB' => '跨縣市（新湖中壢）',
    'K1HB' => '跨縣市（大湖中壢）',
    'K2HB' => '跨縣市（苗栗中壢）',
    'K3HB' => '跨縣市（通霄中壢）',
    'K4HB' => '跨縣市（竹南中壢）',
    'K5HB' => '跨縣市（銅鑼中壢）',
    'K6HB' => '跨縣市（頭份中壢）',
    'M1HB' => '跨縣市（南投中壢）',
    'M2HB' => '跨縣市（草屯中壢）',
    'M3HB' => '跨縣市（埔里中壢）',
    'M4HB' => '跨縣市（竹山中壢）',
    'M5HB' => '跨縣市（水里中壢）',
    'N1HB' => '跨縣市（彰化中壢）',
    'N2HB' => '跨縣市（和美中壢）',
    'N3HB' => '跨縣市（鹿港中壢）',
    'N4HB' => '跨縣市（員林中壢）',
    'N5HB' => '跨縣市（田中中壢）',
    'N6HB' => '跨縣市（北斗中壢）',
    'N7HB' => '跨縣市（二林中壢）',
    'N8HB' => '跨縣市（溪湖中壢）',
    'O1HB' => '跨縣市（新竹市中壢）',
    'P1HB' => '跨縣市（斗六中壢）',
    'P2HB' => '跨縣市（斗南中壢）',
    'P3HB' => '跨縣市（西螺中壢）',
    'P4HB' => '跨縣市（虎尾中壢）',
    'P5HB' => '跨縣市（北港中壢）',
    'P6HB' => '跨縣市（台西中壢）',
    'Q1HB' => '跨縣市（朴子中壢）',
    'Q2HB' => '跨縣市（大林中壢）',
    'Q3HB' => '跨縣市（水上中壢）',
    'Q4HB' => '跨縣市（竹崎中壢）',
    'T1HB' => '跨縣市（屏東中壢）',
    'T2HB' => '跨縣市（里港中壢）',
    'T3HB' => '跨縣市（潮州中壢）',
    'T4HB' => '跨縣市（東港中壢）',
    'T5HB' => '跨縣市（恆春中壢）',
    'T6HB' => '跨縣市（枋寮中壢）',
    'U1HB' => '跨縣市（花蓮中壢）',
    'U2HB' => '跨縣市（鳳林中壢）',
    'U3HB' => '跨縣市（玉里中壢）',
    'V1HB' => '跨縣市（台東中壢）',
    'V2HB' => '跨縣市（成功中壢）',
    'V3HB' => '跨縣市（關山中壢）',
    'V4HB' => '跨縣市（太麻里中壢）',
    'W1HB' => '跨縣市（金門中壢）',
    'X1HB' => '跨縣市（澎湖中壢）',
    'Z1HB' => '跨縣市（連江中壢）',
    // 收件所是中壢(H2)
    'H2AA' => '跨縣市（中壢古亭）',
    'H2AB' => '跨縣市（中壢建成）',
    'H2AC' => '跨縣市（中壢中山）',
    'H2AD' => '跨縣市（中壢松山）',
    'H2AE' => '跨縣市（中壢士林）',
    'H2AF' => '跨縣市（中壢大安）',
    'H2BA' => '跨縣市（中壢中山）',
    'H2BB' => '跨縣市（中壢中正）',
    'H2BC' => '跨縣市（中壢中興）',
    'H2BD' => '跨縣市（中壢豐原）',
    'H2BE' => '跨縣市（中壢大甲）',
    'H2BF' => '跨縣市（中壢清水）',
    'H2BG' => '跨縣市（中壢東勢）',
    'H2BH' => '跨縣市（中壢雅潭）',
    'H2BI' => '跨縣市（中壢大里）',
    'H2BJ' => '跨縣市（中壢太平）',
    'H2BK' => '跨縣市（中壢龍井）',
    'H2CB' => '跨縣市（中壢信義）',
    'H2CC' => '跨縣市（中壢安樂）',
    'H2DA' => '跨縣市（中壢台南）',
    'H2DB' => '跨縣市（中壢安南）',
    'H2DC' => '跨縣市（中壢東南）',
    'H2DD' => '跨縣市（中壢鹽水）',
    'H2DE' => '跨縣市（中壢白河）',
    'H2DF' => '跨縣市（中壢麻豆）',
    'H2DG' => '跨縣市（中壢佳里）',
    'H2DH' => '跨縣市（中壢新化）',
    'H2DI' => '跨縣市（中壢歸仁）',
    'H2DJ' => '跨縣市（中壢玉井）',
    'H2DK' => '跨縣市（中壢永康）',
    'H2EA' => '跨縣市（中壢鹽埕）',
    'H2EB' => '跨縣市（中壢新興）',
    'H2EC' => '跨縣市（中壢前鎮）',
    'H2ED' => '跨縣市（中壢三民）',
    'H2EE' => '跨縣市（中壢楠梓）',
    'H2EF' => '跨縣市（中壢岡山）',
    'H2EG' => '跨縣市（中壢鳳山）',
    'H2EH' => '跨縣市（中壢旗山）',
    'H2EI' => '跨縣市（中壢仁武）',
    'H2EJ' => '跨縣市（中壢路竹）',
    'H2EK' => '跨縣市（中壢美濃）',
    'H2EL' => '跨縣市（中壢大寮）',
    'H2FA' => '跨縣市（中壢板橋）',
    'H2FB' => '跨縣市（中壢新莊）',
    'H2FC' => '跨縣市（中壢新店）',
    'H2FD' => '跨縣市（中壢汐止）',
    'H2FE' => '跨縣市（中壢淡水）',
    'H2FF' => '跨縣市（中壢瑞芳）',
    'H2FG' => '跨縣市（中壢三重）',
    'H2FH' => '跨縣市（中壢中和）',
    'H2FI' => '跨縣市（中壢樹林）',
    'H2GA' => '跨縣市（中壢羅東）',
    'H2GB' => '跨縣市（中壢宜蘭）',
    'A1HA' => '跨縣市（古亭桃園）',
    'A1HB' => '跨縣市（古亭中壢）',
    'A1HC' => '跨縣市（古亭大溪）',
    'A1HD' => '跨縣市（古亭楊梅）',
    'A1HE' => '跨縣市（古亭蘆竹）',
    'A1HF' => '跨縣市（古亭八德）',
    'A1HG' => '跨縣市（古亭平鎮）',
    'A1HH' => '跨縣市（古亭龜山）',
    'H2IA' => '跨縣市（中壢嘉義市）',
    'H2JB' => '跨縣市（中壢竹北）',
    'H2JC' => '跨縣市（中壢竹東）',
    'H2JD' => '跨縣市（中壢新湖）',
    'H2KA' => '跨縣市（中壢大湖）',
    'H2KB' => '跨縣市（中壢苗栗）',
    'H2KC' => '跨縣市（中壢通霄）',
    'H2KD' => '跨縣市（中壢竹南）',
    'H2KE' => '跨縣市（中壢銅鑼）',
    'H2KF' => '跨縣市（中壢頭份）',
    'H2MA' => '跨縣市（中壢南投）',
    'H2MB' => '跨縣市（中壢草屯）',
    'H2MC' => '跨縣市（中壢埔里）',
    'H2MD' => '跨縣市（中壢竹山）',
    'H2ME' => '跨縣市（中壢水里）',
    'H2NA' => '跨縣市（中壢彰化）',
    'H2NB' => '跨縣市（中壢和美）',
    'H2NC' => '跨縣市（中壢鹿港）',
    'H2ND' => '跨縣市（中壢員林）',
    'H2NE' => '跨縣市（中壢田中）',
    'H2NF' => '跨縣市（中壢北斗）',
    'H2NG' => '跨縣市（中壢二林）',
    'H2NH' => '跨縣市（中壢溪湖）',
    'H2OA' => '跨縣市（中壢新竹市）',
    'H2PA' => '跨縣市（中壢斗六）',
    'H2PB' => '跨縣市（中壢斗南）',
    'H2PC' => '跨縣市（中壢西螺）',
    'H2PD' => '跨縣市（中壢虎尾）',
    'H2PE' => '跨縣市（中壢北港）',
    'H2PF' => '跨縣市（中壢台西）',
    'H2QB' => '跨縣市（中壢朴子）',
    'H2QC' => '跨縣市（中壢大林）',
    'H2QD' => '跨縣市（中壢水上）',
    'H2QE' => '跨縣市（中壢竹崎）',
    'H2TA' => '跨縣市（中壢屏東）',
    'H2TB' => '跨縣市（中壢里港）',
    'H2TC' => '跨縣市（中壢潮州）',
    'H2TD' => '跨縣市（中壢東港）',
    'H2TE' => '跨縣市（中壢恆春）',
    'H2TF' => '跨縣市（中壢枋寮）',
    'H2UA' => '跨縣市（中壢花蓮）',
    'H2UB' => '跨縣市（中壢鳳林）',
    'H2UC' => '跨縣市（中壢玉里）',
    'H2VA' => '跨縣市（中壢台東）',
    'H2VB' => '跨縣市（中壢成功）',
    'H2VC' => '跨縣市（中壢關山）',
    'H2VD' => '跨縣市（中壢太麻里）',
    'H2WA' => '跨縣市（中壢金門）',
    'H2XA' => '跨縣市（中壢澎湖）',
    'H2ZA' => '跨縣市（中壢連江）'
);

const SUR_WORD = array(
    //"HB11" => "中地測數",
    "HB12" => "中地測丈",
    "HB13" => "中地測建",
    //"HB14" => "中地測法",
    "HB17" => "中地法土",
    "HB18" => "中地法建",
);
?>
