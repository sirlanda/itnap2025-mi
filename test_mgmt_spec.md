# Tesztmenedzsment Eszköz Rendszer Specifikáció

## 1. Bevezetés

### 1.1 Cél
Ez a dokumentum egy Tesztmenedzsment Eszköz specifikációját tartalmazza, amely a tesztesetek kezelési folyamatának egyszerűsítésére szolgál, a létrehozástól a végrehajtáson át a jelentéskészítésig. A rendszer célja egy központosított platform biztosítása a tesztelési tevékenységek kezeléséhez szervezetünkön belül.

### 1.2 Hatókör
A Tesztmenedzsment Eszköz lehetővé teszi a tesztelő csapataink számára a tesztesetek hatékony létrehozását, rendszerezését, végrehajtását és jelentéskészítését. Az eszközt a szervezeten belüli több projektben és alkalmazásban használják majd.

### 1.3 Definíciók és Rövidítések
- **TE**: Teszteset
- **TT**: Tesztterv
- **TJ**: Tesztjelentés
- **FH**: Felhasználói Felület
- **API**: Alkalmazásprogramozási Interfész

## 2. Fejlesztendő rendszer

A Tesztmenedzsment Eszköz egy önálló webalkalmazás lesz, amely webböngészőn keresztül érhető el. Saját adatbázissal rendelkezik a tesztesetek, teszttervek és végrehajtási eredmények tárolására.

### 2.1 Megvalósítandó feladatok
A rendszer a következő funkciókat biztosítja:
- Felhasználói hitelesítés és jogosultságkezelés
- Teszteset kezelés
- Tesztterv összeállítás
- Teszt végrehajtás
- Jelentéskészítés
- Értesítések

## 3. Funkcionális Követelmények

### 3.1 Alapkövetelmények

#### 3.1.1 Felhasználói Hitelesítés
- A rendszernek biztonságos bejelentkezési és regisztrációs mechanizmust kell biztosítania
  - felhasználónév (vezeteknev.keresztnev)
  - jelszó
  - email cím
  - email hitelesítő kód
- A felhasználóknak felhasználónévvel és jelszóval kell bejelentkezni
- A sikertelen bejelentkezési kísérletek számát korlátozni kell a brute force támadások megakadályozása érdekében
- Jelszó-helyreállítási mechanizmust kell biztosítani
- A munkamenet 30 perc inaktivitás után lejár

#### 3.1.2 Teszteset Kezelés
- A rendszernek lehetővé kell tennie a felhasználók számára új tesztesetek létrehozását
- Minden tesztesetnek tartalmaznia kell:
  - Egyedi azonosítót
  - Címet
  - Leírást
  - Előfeltételeket
  - Lépésről lépésre szóló utasításokat
  - Minden lépéshez várt eredményeket
  - Prioritást (Magas, Közepes, Alacsony)
  - Állapotot (Vázlat, Kész, Elavult)
- A rendszernek lehetővé kell tennie a meglévő tesztesetek módosítását
- A rendszernek lehetővé kell tennie a tesztlépések átrendezését egy teszteseten belül
- A rendszernek keresési funkciót kell biztosítania a tesztesetek különböző kritériumok alapján történő megtalálásához
- A rendszernek lehetővé kell tennie a tesztesetek modulok/funkciók szerinti kategorizálását

#### 3.1.3 Tesztterv Összeállítás
- A rendszernek lehetővé kell tennie a felhasználók számára teszttervek létrehozását
- A tesztterveknek tartalmazniuk kell:
  - Egyedi azonosítót
  - Nevet
  - Leírást
  - Tesztesetek listáját
  - Tervezett végrehajtási dátumokat
- A rendszernek lehetővé kell tennie a teszttervek módosítását
- A rendszernek támogatnia kell a tesztesetek szűrését és rendezését egy tesztterven belül
- A rendszernek támogatnia kell a tesztesetek hozzárendelését adott tesztelőkhöz

#### 3.1.4 Teszt Végrehajtás
- A rendszernek felületet kell biztosítania a tesztesetek végrehajtásához
- Minden tesztlépéshez a rendszernek lehetővé kell tennie a következők rögzítését:
  - Tényleges eredmény
  - Sikeres/Sikertelen állapot
  - Megjegyzések
  - Mellékletek (képernyőképek, naplófájlok)
- A rendszernek nyomon kell követnie minden teszteset végrehajtási állapotát
- A rendszernek rögzítenie kell a végrehajtási időt és időtartamot
- A rendszernek lehetővé kell tennie a teszt végrehajtás felfüggesztését és folytatását
- A rendszernek nyomon kell követnie az általános tesztterv végrehajtási folyamatát

#### 3.1.5 Teszt Jelentéskészítés
- A rendszernek XML és Excel (kötelező) és bármilyen opcionális (docx, pdf) formátumban kell jelentéseket készítenie
- A jelentéseknek tartalmazniuk kell:
  - Teszt végrehajtási összefoglaló (sikeres/sikertelen statisztikák)
  - Részletes teszteredmények
  - Végrehajtási folyamat nyomon követése
  - Irányítópultok kulcsfontosságú mérőszámokkal
- A rendszernek szűrési lehetőségeket kell biztosítania a jelentésekhez
- A rendszernek lehetővé kell tennie az időszakos jelentések ütemezését
- A rendszernek biztosítania kell a teszteredmények vizualizációját (diagramok, grafikonok)

#### 3.1.6 Értesítések
- A rendszernek értesítéseket kell küldenie a következőkről:
  - Teszteset hozzárendelések
  - Tesztterv változások
  - Közelgő határidők
  - Teszt végrehajtások befejezése
- Az értesítéseket e-mailben kell küldeni
- A felhasználóknak lehetőségük kell hogy legyen az értesítési beállítások konfigurálására

### 3.2 Opcionális Követelmények

#### 3.2.1 Teszteset Verziókezelés
- A rendszernek nyilván kell tartania a tesztesetek változásainak előzményeit
- Minden teszteset verziójának visszakereshetőnek kell lennie
- A rendszernek meg kell jelenítenie a verziók közötti különbségeket
- A rendszernek lehetővé kell tennie a korábbi verziókhoz való visszatérést
- A rendszernek rögzítenie kell, hogy ki végzett változtatásokat és mikor

#### 3.2.2 Csoportos Frissítés
- A rendszernek támogatnia kell a következők csoportos frissítését:
  - Teszteset attribútumok (állapot, prioritás, kategória)
  - Teszt végrehajtási eredmények
  - Hozzárendelések
- A rendszernek előnézetet kell biztosítania a változtatásokról azok alkalmazása előtt
- A rendszernek lehetővé kell tennie több elem kiválasztását frissítéshez
- A rendszernek visszavonási funkciót kell biztosítania a csoportos frissítésekhez

#### 3.2.3 Jogosultság Beállítások
- A rendszernek támogatnia kell a szerepkör alapú hozzáférés-vezérlést
- A jogosultságoknak konfigurálhatónak kell lenniük:
  - Projekt szinten
  - Alkalmazás szinten
- A felhasználói szerepköröknek a következőket kell tartalmazniuk:
  - Adminisztrátor
  - Teszt Menedzser
  - Teszt Vezető
  - Tesztelő
  - Betekintő
- Minden szerepkörnek különböző hozzáférési szinttel kell rendelkeznie a funkciókhoz
- A rendszernek lehetővé kell tennie a jogosultságok testreszabását adott felhasználók számára

#### 3.2.4 Integráció a Redmine-nal
- A rendszernek integrációt kell biztosítania a Redmine hibakövetővel
- Az integrációnak tartalmaznia kell:
  - Tesztesetek összekapcsolását Redmine hibajegyekkel
  - Hibajegyek automatikus létrehozását sikertelen tesztekhez
  - Állapot szinkronizációt a tesztesetek és hibajegyek között
  - Redmine hibajegy információk megjelenítését a tesztmenedzsment eszközön belül
- A rendszernek lehetővé kell tennie a Redmine kapcsolat konfigurálását
- A rendszernek biztonságosan kell kezelnie a Redmine hitelesítést

## 4. Elfogadási Kritériumok és Rendszer Korlátok

### 4.1 Minimális Elfogadási Kritériumok
- **Teszteset létrehozás (lépésről lépésre, módosítás)**: A rendszernek képesnek kell lennie új tesztesetek létrehozására részletes lépésekkel, azok módosítására és a lépések átrendezésére. Ez a funkció alapvető fontosságú és prioritást élvez minden más funkcióval szemben.

- **Teszt jelentéskészítés (XML, Excel)**: A rendszernek képesnek kell lennie jelentések készítésére XML és Excel formátumban a teszteredményekről. Ez a funkció alapvető fontosságú és prioritást élvez minden más funkcióval szemben. A tesztjelentéseknek elérhetőeknek kell lenniük a webalkalmazás felületén is. Egy a fejlesztő által preferált megvalósításai formában.

Ezek a funkciók képviselik a projekt minimális életképes termékét (MVP), és a projekt sikerességének alapvető feltételét jelentik. Ezen felül minden a 3.1-ben felsorolt funkcionalításokból minden használati esetből el kell készülnie valaminek, de fent rögzített két esetnek a leírásban szereplően teljeskörűen el kell készülnie.

**Leadandó eredménytermékek:**
- Fizikai Rendszerterv
- Logika Rendszerterv
- Tesztelési terv és jegyzőkönyv
- Forráskód (vagy teljes prompt)

Az opcionális feladatok közül bármelyik szabadon választható a rendelkezésre álló fejlesztési időn belül.

### 4.2 Technikai Korlátok
- A rendszernek web alapúnak kell lennie és standard böngészőkön keresztül elérhetőnek
- A rendszernek támogatnia kell az egyidejű felhasználókat (minimum 50)
- A rendszernek 3 másodpercen belül kell reagálnia a felhasználói műveletekre
- A rendszernek SSL/TLS használatával kell biztosítania az összes adatátvitelt

### 4.3 Üzleti Korlátok
- A rendszert egy napon belül kell fejleszteni és telepíteni
- A rendszernek akár 10.000 teszteset adatbázisát is kezelnie kell
- A rendszernek akár 100 projektet is támogatnia kell
- A rendszernek skálázhatónak kell lennie a jövőbeli növekedés kezeléséhez
- A rendszernek meg kell felelnie a vállalati adatvédelmi szabályzatoknak