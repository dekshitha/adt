USE ResQFeast;

CREATE TABLE StoreHistory (
    StoreHistoryID INT NOT NULL,
    StoreID INT NOT NULL,
    StoreName VARCHAR(100),
    StoreAddress VARCHAR(255),
    Email VARCHAR(100),
    ContactNumber VARCHAR(20),
    StoreLogo VARBINARY(MAX),
    ChangeDate DATETIME NOT NULL,
    ChangeDescription VARCHAR(255) NOT NULL,
    CONSTRAINT PK_StoreHistory PRIMARY KEY (StoreHistoryID),
    CONSTRAINT FK_StoreHistory_StoreID FOREIGN KEY (StoreID) REFERENCES Store(StoreID)
);
