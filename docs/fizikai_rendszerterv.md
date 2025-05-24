# Fizikai Rendszerterv

## 1. Bevezetés

Ez a dokumentum az itnap2025-mi projekt fizikai rendszertervét tartalmazza, amely egy tesztelési menedzsment alkalmazás. Az alkalmazás lehetővé teszi a tesztesetek kezelését, teszttervek létrehozását, végrehajtását és jelentések generálását.

## 2. Rendszer architektúra

### 2.1 Technológiai stack

Az alkalmazás a következő technológiákat használja:

- **Frontend**: 
  - Next.js 15.2.3 (React-alapú keretrendszer)
  - React 18.3.1 
  - TypeScript
  - Tailwind CSS (stílusozáshoz)
  - Radix UI komponensek (felhasználói felület elemekhez)
  - React Hook Form (form kezeléshez)
  - TanStack Query (adatlekérések kezeléséhez)

- **Backend**:
  - Next.js API Routes (szerver oldali logikához)
  - Drizzle ORM (adatbázis kezeléshez)
  - SQLite (adatbázis)

### 2.2 Rendszer komponensek

#### 2.2.1 Frontend komponensek

- **Oldal komponensek**: A `/src/app` könyvtárban található oldalak.
  - Dashboard főoldal
  - Bejelentkezés és regisztráció
  - Teszteset kezelő
  - Tesztterv kezelő
  - Teszt végrehajtás
  - Jelentések kezelése
  - Beállítások
  - AI-javaslatok

- **UI komponensek**: A `/src/components` könyvtárban található újrafelhasználható UI elemek.
  - Űrlapok és beviteli mezők
  - Táblázatok és listák
  - Navigációs elemek
  - Modális ablakok és dialógusok

#### 2.2.2 Backend komponensek

- **API végpontok**: A `/src/app/api` könyvtárban található API route-ok.
  - Teszteset API-k
  - Tesztterv API-k
  - Jelentés API-k

- **Szerver oldali műveletek**: A `/src/server/actions` könyvtárban található szerver oldali műveletek.
  - Teszteset műveletek
  - Tesztterv végrehajtási műveletek
  - Jelentés generálási műveletek

- **Adatbázis réteg**: A `/src/lib/db.ts` által definiált adatbázis kapcsolat.

### 2.3 Adatbázis struktúra

Az alkalmazás SQLite adatbázist használ Drizzle ORM-mel. A migrációs fájlok a `/drizzle` könyvtárban találhatók:

- Alapvető entitások:
  - Felhasználók
  - Tesztesetek
  - Teszttervek
  - Teszt végrehajtások
  - Jelentések

## 3. Telepítési környezet

### 3.1 Fejlesztési környezet

- Node.js futtatókörnyezet
- npm/yarn csomagkezelő
- Git verziókezelő
- TypeScript fejlesztői eszközök
- SQLite adatbázis

### 3.2 Üzemeltetési környezet

Az alkalmazás többféle környezetben üzemeltethető:

- Fejlesztési környezet: `npm run dev`
- Előkészítés buildelése: `npm run build`
- Üzemeltetési környezet: `npm run start`

## 4. Rendszerintegráció

A rendszer moduláris felépítésű és az alábbi integrációkat tartalmazza:

- React komponensek közötti integráció
- API végpontok és frontend közötti kommunikáció
- Adatbázis műveletek és szerver oldali logika

## 5. Biztonsági megfontolások

- Felhasználói autentikáció és jogosultságkezelés
- Inputvalidáció a frontend és backend oldalon
- API végpontok védelme
- Adatbázis műveletek biztonságos kezelése

## 6. Teljesítmény optimalizáció

- React komponensek memoizációja
- Lapozott adatlekérés
- Optimalizált adatbázis lekérdezések
- Kliens oldali gyorsítótárazás (caching)
- Szerver oldali renderelés (SSR) és statikus oldalgenerálás (SSG)

## 7. Tesztelési stratégia

- Egységtesztek a kritikus komponensekhez
- Integrációs tesztek az API végpontokhoz
- End-to-end tesztek a fontosabb felhasználói folyamatokhoz
- Teljesítménytesztek

## 8. Üzemeltetés és karbantartás

- Rendszeres biztonsági frissítések
- Adatbázis karbantartás és optimalizáció
- Monitorozási stratégia
- Hibaelhárítási folyamatok

## 9. Skálázhatóság

A rendszer horizontálisan és vertikálisan is skálázható:
- Horizontális skálázás: Több szerver példány használata terheléselosztóval
- Vertikális skálázás: Erőforrások bővítése (CPU, memória)

## 10. Függőségek

A rendszer főbb függőségei:
- Next.js és React - Frontend keretrendszer
- Radix UI - UI komponenskönyvtár
- Drizzle ORM - Adatbázis ORM
- SQLite - Adatbázis rendszer
- Tailwind CSS - CSS keretrendszer
- TanStack Query - Adatkezelés és adatlekérés kezelése

---

Készítette: GitHub Copilot
Dátum: 2025. május 24.
