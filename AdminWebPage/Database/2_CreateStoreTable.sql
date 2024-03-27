USE ResQFeast;

CREATE SEQUENCE StoreHistoryIDSequence
    START WITH 1
    INCREMENT BY 1;

CREATE TABLE Store (
    StoreID INT IDENTITY(1,1) NOT NULL,
    StoreHistoryID INT NOT NULL DEFAULT (NEXT VALUE FOR StoreHistoryIDSequence),
    StoreName VARCHAR(100),
    StoreAddress VARCHAR(255),
    Email VARCHAR(100),
    ContactNumber VARCHAR(20),
    StoreLogo VARBINARY(MAX),
    PRIMARY KEY (StoreID)
);
