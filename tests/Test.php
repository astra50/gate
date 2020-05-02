<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use const true;

final class Test extends TestCase
{
    public function test(): void
    {
        static::assertTrue(true);
    }
}
