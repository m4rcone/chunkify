exports.up = (pgm) => {
  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "varchar(120)",
      notNull: true,
    },
    description: {
      type: "varchar(500)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('UTC', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('UTC', now())"),
    },
    column_id: {
      type: "uuid",
      notNull: true,
      references: "columns(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = false;
