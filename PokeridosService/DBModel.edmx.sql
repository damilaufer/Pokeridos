
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, and Azure
-- --------------------------------------------------
-- Date Created: 01/13/2013 16:41:37
-- Generated from EDMX file: C:\Users\damianl\Desktop\Pokeridos\PokeridosService\DBModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [Pokeridos];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_GameTournament]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Games] DROP CONSTRAINT [FK_GameTournament];
GO
IF OBJECT_ID(N'[dbo].[FK_GamePlayerPlayer]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[GamePlayers] DROP CONSTRAINT [FK_GamePlayerPlayer];
GO
IF OBJECT_ID(N'[dbo].[FK_GamePlayerGame]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[GamePlayers] DROP CONSTRAINT [FK_GamePlayerGame];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Players]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Players];
GO
IF OBJECT_ID(N'[dbo].[Tournaments]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Tournaments];
GO
IF OBJECT_ID(N'[dbo].[Games]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Games];
GO
IF OBJECT_ID(N'[dbo].[GamePlayers]', 'U') IS NOT NULL
    DROP TABLE [dbo].[GamePlayers];
GO
IF OBJECT_ID(N'[dbo].[BlindLevels]', 'U') IS NOT NULL
    DROP TABLE [dbo].[BlindLevels];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Players'
CREATE TABLE [dbo].[Players] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(10)  NOT NULL,
    [PictureName] nvarchar(20)  NOT NULL
);
GO

-- Creating table 'Tournaments'
CREATE TABLE [dbo].[Tournaments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(20)  NOT NULL,
    [FromDate] datetime  NOT NULL,
    [ToDate] datetime  NOT NULL,
    [BuyInAmount] int  NOT NULL,
    [WinnerId] int  NULL
);
GO

-- Creating table 'Games'
CREATE TABLE [dbo].[Games] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Date] datetime  NOT NULL,
    [TournamentId] int  NOT NULL
);
GO

-- Creating table 'GamePlayers'
CREATE TABLE [dbo].[GamePlayers] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [RebuyRoundIndex] int  NULL,
    [LostRoundIndex] int  NULL,
    [FinalPosition] int  NOT NULL,
    [PlayerId] int  NOT NULL,
    [GameId] int  NOT NULL,
    [Winnings] int  NOT NULL
);
GO

-- Creating table 'BlindLevels'
CREATE TABLE [dbo].[BlindLevels] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PeriodInMinutes] int  NOT NULL,
    [Amount] int  NOT NULL,
    [AnteAmount] int  NOT NULL,
    [Order] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Players'
ALTER TABLE [dbo].[Players]
ADD CONSTRAINT [PK_Players]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Tournaments'
ALTER TABLE [dbo].[Tournaments]
ADD CONSTRAINT [PK_Tournaments]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [PK_Games]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'GamePlayers'
ALTER TABLE [dbo].[GamePlayers]
ADD CONSTRAINT [PK_GamePlayers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'BlindLevels'
ALTER TABLE [dbo].[BlindLevels]
ADD CONSTRAINT [PK_BlindLevels]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [TournamentId] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_GameTournament]
    FOREIGN KEY ([TournamentId])
    REFERENCES [dbo].[Tournaments]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GameTournament'
CREATE INDEX [IX_FK_GameTournament]
ON [dbo].[Games]
    ([TournamentId]);
GO

-- Creating foreign key on [PlayerId] in table 'GamePlayers'
ALTER TABLE [dbo].[GamePlayers]
ADD CONSTRAINT [FK_GamePlayerPlayer]
    FOREIGN KEY ([PlayerId])
    REFERENCES [dbo].[Players]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GamePlayerPlayer'
CREATE INDEX [IX_FK_GamePlayerPlayer]
ON [dbo].[GamePlayers]
    ([PlayerId]);
GO

-- Creating foreign key on [GameId] in table 'GamePlayers'
ALTER TABLE [dbo].[GamePlayers]
ADD CONSTRAINT [FK_GamePlayerGame]
    FOREIGN KEY ([GameId])
    REFERENCES [dbo].[Games]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GamePlayerGame'
CREATE INDEX [IX_FK_GamePlayerGame]
ON [dbo].[GamePlayers]
    ([GameId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------