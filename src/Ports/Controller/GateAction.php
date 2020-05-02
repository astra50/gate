<?php
declare(strict_types=1);

namespace App\Ports\Controller;

use Symfony\Component\HttpFoundation\Response;

final class GateAction
{
    public function __invoke(): Response
    {
        return new Response('Here is Button!');
    }
}
