CREATE MIGRATION m1wlmrqdpicgpf6i4nei3nxo324inn3t4boxrm533etaw24ubrvnaq
    ONTO m173d5k4l5uhyh5l6dpqxxghbvgqckyu5izgiggmvqjfbnqr4utbvq
{
  ALTER TYPE default::Product {
      CREATE PROPERTY medium_image_url: std::str;
  };
};
