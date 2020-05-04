<?php

declare(strict_types=1);

namespace App\Ports\Controller;

use App\Domain\User\User;
use phpcent\Client as Centrifugo;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * @method User getUser()
 */
final class GateAction extends AbstractController
{
    private Centrifugo $centrifugo;

    public function __construct(Centrifugo $centrifugo)
    {
        $this->centrifugo = $centrifugo;
    }

    public function __invoke(): Response
    {
        $user = $this->getUser();

        return $this->render('gate.html.twig', [
            'centrifugo_token' => $this->centrifugo->generateConnectionToken($user->toId()->toString()),
        ]);
    }
}
