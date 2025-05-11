exports.up = (pgm) => {
  pgm.createTable("subtasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "varchar(120)",
      notNull: true,
    },
    is_completed: {
      type: "boolean",
      notNull: true,
      default: false,
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
    task_id: {
      type: "uuid",
      notNull: true,
      references: "tasks(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = false;
