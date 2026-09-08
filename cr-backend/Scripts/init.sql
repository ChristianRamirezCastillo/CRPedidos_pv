IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    CREATE TABLE [Pedidos] (
        [Id] int NOT NULL IDENTITY,
        [NumeroPedido] nvarchar(50) NOT NULL,
        [Cliente] nvarchar(150) NOT NULL,
        [Fecha] datetime2 NOT NULL,
        [Total] decimal(10,2) NOT NULL,
        [Estado] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_Pedidos] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    CREATE TABLE [Usuarios] (
        [Id] int NOT NULL IDENTITY,
        [Email] nvarchar(150) NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [Rol] nvarchar(50) NOT NULL DEFAULT N'User',
        CONSTRAINT [PK_Usuarios] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Cliente', N'Estado', N'Fecha', N'NumeroPedido', N'Total') AND [object_id] = OBJECT_ID(N'[Pedidos]'))
        SET IDENTITY_INSERT [Pedidos] ON;
    EXEC(N'INSERT INTO [Pedidos] ([Id], [Cliente], [Estado], [Fecha], [NumeroPedido], [Total])
    VALUES (1, N''Juan Perez'', N''Registrado'', ''2025-01-10T10:00:00.0000000Z'', N''PED-001'', 250.75)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Cliente', N'Estado', N'Fecha', N'NumeroPedido', N'Total') AND [object_id] = OBJECT_ID(N'[Pedidos]'))
        SET IDENTITY_INSERT [Pedidos] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Email', N'PasswordHash', N'Rol') AND [object_id] = OBJECT_ID(N'[Usuarios]'))
        SET IDENTITY_INSERT [Usuarios] ON;
    EXEC(N'INSERT INTO [Usuarios] ([Id], [Email], [PasswordHash], [Rol])
    VALUES (1, N''admin@test.com'', N''$2a$11$dummyhashwillbereplacedonstartup'', N''Admin''),
    (2, N''user@email.com'', N''$2a$11$dummyhashuserwillbereplaced'', N''User'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Email', N'PasswordHash', N'Rol') AND [object_id] = OBJECT_ID(N'[Usuarios]'))
        SET IDENTITY_INSERT [Usuarios] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Pedidos_NumeroPedido] ON [Pedidos] ([NumeroPedido]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Usuarios_Email] ON [Usuarios] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260908161210_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260908161210_InitialCreate', N'9.0.0');
END;

COMMIT;
GO

