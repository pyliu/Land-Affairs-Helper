SELECT LPAD( DD45, 1, ' ' ) || LPAD( DD46, 2, '0' ) || LPAD( DD48, 4, '0' ) || LPAD(DD49, 8, ' ') || LPAD(DD05, 7, ' ') || LPAD(DD06, 2, ' ') || LPAD(DD08*100, 8, ' ' ) || RPAD(CASE
       WHEN DD09 IS NULL THEN ' '
       WHEN DD09 = '' THEN ' '
       ELSE DD09
END, 60, ' ' ) || LPAD(DD11, 1, ' ') || LPAD(DD12, 2, ' ') || LPAD(DD13, 3 , '0') || LPAD(DD16, 7, ' ') AS AI00701 FROM SRDBID
WHERE 
-- 判斷含地建號
-- (DD48 || DD49 BETWEEN '036200000000' AND '036399999999')
-- 直接取段號全部
DD48 in (LPAD('362', 4, '0'), LPAD('363', 4, '0'))