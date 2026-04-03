<?php
/*
Plugin Name: XML WooCommerce Import by ID
Description: Импорт товаров из XML с русскими тегами, используя <Ид> как SKU
Version: 1.1
Author: Your Name
*/

if (!defined('ABSPATH')) exit;

// ==================== Функция импорта ====================
function xml_woo_import_run() {

    $file = WP_CONTENT_DIR . '/uploads/products.xml';

    if (!file_exists($file)) {
        wp_die('Файл XML не найден!');
    }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_file($file);

    if (!$xml) {
        wp_die('Ошибка загрузки XML');
    }

    foreach ($xml->Товары->Товар as $item) {

        // ===== 1. Основные поля =====
        $sku = (string)$item->{'Ид'}; // используем Ид как SKU
        $name = (string)$item->{'наименование'};
        $description = (string)$item->{'Описание'};
        $weight = (string)$item->{'вес'};
        $length = (string)$item->{'Длина'};
        $width = (string)$item->{'Ширина'};
        $height = (string)$item->{'высота'};

        if (empty($sku)) continue; // пропускаем если нет Ид

        // ===== 2. Проверка существующего товара =====
        $product_id = wc_get_product_id_by_sku($sku);

        if ($product_id) {
            $product = wc_get_product($product_id);
        } else {
            $product = new WC_Product_Simple();
            $product->set_sku($sku);
        }

        $product->set_name($name ?: 'Товар');
        $product->set_description($description ?: '');
        $product->set_status('publish');

        // ===== 3. Размеры и вес =====
        if ($weight) $product->set_weight($weight);
        if ($length) $product->set_length($length);
        if ($width) $product->set_width($width);
        if ($height) $product->set_height($height);

        // ===== 4. Категории =====
        foreach ($item->группы->Ид as $group) {
            $cat_name = (string)$group;
            if (!$cat_name) continue;

            $term = term_exists($cat_name, 'product_cat');
            if (!$term) $term = wp_insert_term($cat_name, 'product_cat');
            if (!is_wp_error($term)) {
                wp_set_object_terms($product->get_id(), (int)$term['term_id'], 'product_cat', true);
            }
        }

        // ===== 5. Атрибуты =====
        $attributes = [];

        if (isset($item->значениеСвойств->значениеСвойства)) {
            foreach ($item->значениеСвойств->значениеСвойства as $prop) {
                $attr_name = (string)$prop->ид; // или <Наименование>
                $attr_value = (string)$prop->значение;
                if ($attr_name && $attr_value) $attributes[$attr_name] = $attr_value;
            }
        }

        if ($attributes) {
            $product_attributes = [];
            foreach ($attributes as $attr_name => $attr_value) {
                $taxonomy = 'pa_' . sanitize_title($attr_name);

                if (!taxonomy_exists($taxonomy)) {
                    register_taxonomy(
                        $taxonomy,
                        'product',
                        [
                            'label' => $attr_name,
                            'public' => true,
                            'hierarchical' => true,
                            'show_ui' => true,
                            'query_var' => true,
                        ]
                    );
                }

                wp_set_object_terms($product->get_id(), $attr_value, $taxonomy);
                $product_attributes[$taxonomy] = [
                    'name' => $taxonomy,
                    'value' => $attr_value,
                    'is_visible' => 1,
                    'is_variation' => 0,
                    'is_taxonomy' => 1
                ];
            }

            $product->set_attributes($product_attributes);
        }

        // ===== 6. Изображение =====
        if (isset($item->{'картинка'}) && !empty((string)$item->{'картинка'})) {
            $image_url = (string)$item->{'картинка'};

            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $image_id = media_sideload_image($image_url, $product->get_id(), null, 'id');
            if (!is_wp_error($image_id)) {
                $product->set_image_id($image_id);
            }
        }

        $product->save();
    }

    echo 'Импорт завершён!';
}

// ==================== Защищённый запуск через админку ====================
add_action('admin_post_run_xml_import', 'xml_woo_import_run');# Site-Project