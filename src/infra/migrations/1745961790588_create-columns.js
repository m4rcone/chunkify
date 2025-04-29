exports.up = (pgm) => {
  pgm.createTable("columns", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(20)",
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
    board_id: {
      type: "uuid",
      notNull: true,
      references: "boards(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = false;
