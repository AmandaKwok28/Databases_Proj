CREATE TABLE IF NOT EXISTS Institutions (
    Name            VARCHAR(1000) PRIMARY KEY,  
    Established     INTEGER,
    CountryCode     CHAR(2)
);

-- allows No affiliation provided as an option 
INSERT INTO Institutions (Name, Established, CountryCode)
VALUES ('No Affiliation Provided', NULL, NULL)
ON CONFLICT (Name) DO NOTHING;


CREATE TABLE IF NOT EXISTS Author (
    Name            VARCHAR(100) PRIMARY KEY,
    Affiliation     VARCHAR(1000),
    ORCID           CHAR(19),
    FOREIGN KEY (Affiliation) REFERENCES Institutions(Name)
);

-- something I did to seed the database (will need this for reproducibility)
ALTER TABLE Author
DROP CONSTRAINT author_affiliation_fkey;


CREATE TABLE IF NOT EXISTS Race (
    Name            VARCHAR(100) PRIMARY KEY,
    RaceLabel       VARCHAR(20),
    FOREIGN KEY (Name) REFERENCES Author(Name)
);

CREATE TABLE IF NOT EXISTS Gender (
    Name            VARCHAR(100) PRIMARY KEY,
    GenderLabel     VARCHAR(20),
    FOREIGN KEY (Name) REFERENCES Author(Name)
);

CREATE TABLE IF NOT EXISTS Journals (
    LongName        VARCHAR(100) PRIMARY KEY,
    ShortName       VARCHAR(100),
    Publisher       VARCHAR(100),
    ISSN            VARCHAR(10),
    eISSN           VARCHAR(10),
    Category        VARCHAR(50),
    Edition         VARCHAR(10),
    ImpactFactor    DECIMAL(5,1)
);

CREATE TABLE IF NOT EXISTS Articles (
    Title                   VARCHAR(1000),
    Author                  VARCHAR(100),
    Author_Number           INTEGER,
    DOI                     VARCHAR(200),
    Publisher               VARCHAR(200),
    Score                   DECIMAL(5,1),
    URL                     VARCHAR(500),
    Published               VARCHAR(100),
    ISSN                    VARCHAR(20),
    References_Count        INTEGER,
    Is_Referenced_By_Count  INTEGER,
    FOREIGN KEY (Author) REFERENCES Author(Name),
    PRIMARY KEY (Title, Author_Number)
);

CREATE TABLE IF NOT EXISTS Countries (
    Name            VARCHAR(100) PRIMARY KEY,
    CountryCode     CHAR(2)
);
