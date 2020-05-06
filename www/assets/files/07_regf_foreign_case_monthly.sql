SELECT -- REGF 登記主檔－外國人地權登記統計檔 (SREGF)
    MOICAD.REGF.RF03 AS "收件年",
    MOICAD.REGF.RF04_1 AS "收件字",
    MOICAD.REGF.RF04_2 AS "收件號",
    MOICAD.REGF.RF40 AS "註記日期",
    MOICAD.REGF.ITEM AS "項目代碼",
    MOICAD.REGF.RECA AS "土地筆數",
    MOICAD.REGF.RF10 AS "土地面積",
    MOICAD.REGF.RECD AS "建物筆數",
    MOICAD.REGF.RF08 AS "建物面積",
    MOICAD.REGF.RE46 AS "鄉鎮市區代碼"
FROM MOICAD.REGF
WHERE MOICAD.REGF.RF40 LIKE '10904%'
-- RAW
--SELECT MOICAD.REGF.*
--FROM MOICAD.REGF
--WHERE (((MOICAD.REGF.RF40) Between '1080801' And '1080831'))