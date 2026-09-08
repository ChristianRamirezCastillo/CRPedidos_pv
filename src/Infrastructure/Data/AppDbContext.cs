using Microsoft.EntityFrameworkCore;
using CR.PedidosApi.Domain.Entities;

namespace CR.PedidosApi.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Pedido> Pedidos { get; set; } = null!;
        public DbSet<Usuario> Usuarios { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.ToTable("Pedidos");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.NumeroPedido).IsUnique();
                entity.Property(e => e.NumeroPedido).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Cliente).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Fecha).IsRequired();
                entity.Property(e => e.Total).HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.Estado).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Rol).IsRequired().HasMaxLength(50).HasDefaultValue("User");
            });

            // Seed data - Usuarios iniciales
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = 1,
                    Email = "admin@test.com",
                    PasswordHash = "$2a$11$dummyhashwillbereplacedonstartup", // Se rehash en startup (admin123)
                    Rol = "Admin"
                },
                new Usuario
                {
                    Id = 2,
                    Email = "user@email.com",
                    PasswordHash = "$2a$11$dummyhashuserwillbereplaced", // Se rehash en startup (123456)
                    Rol = "User"
                }
            );

            // Seed data - Pedido inicial de ejemplo referencial
            modelBuilder.Entity<Pedido>().HasData(
                new Pedido
                {
                    Id = 1,
                    NumeroPedido = "PED-001",
                    Cliente = "Juan Perez",
                    Fecha = new System.DateTime(2025, 1, 10, 10, 0, 0, System.DateTimeKind.Utc),
                    Total = 250.75m,
                    Estado = "Registrado"
                }
            );
        }
    }
}